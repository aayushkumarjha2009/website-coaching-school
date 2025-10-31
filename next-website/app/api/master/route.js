import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { NextResponse } from "next/server";
import Subject from "@/app/models/subjects";
import connectMongo from "./../../lib/mongodb";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Your frontend origin here
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true"

};

let GITHUB_TOKEN = process.env.GITHUB_TOKEN

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_here";
const URL = "https://api.github.com/repos/aayushkumarjha2009/coaching-data/contents"

export async function POST(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const body = await request.json();


  if (body.type === "connect") {
    try {
      const url = `${URL}/passwords/master-admin.json`;

      const githubRes = await fetch(url, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3.raw",
        },
      });

      if (!githubRes.ok) {
        const errorBody = await githubRes.json();
        return NextResponse.json(
          { message: errorBody.message || "GitHub API error" },
          { status: githubRes.status, headers: corsHeaders }
        );
      }

      const content = await githubRes.json();
      if (content.pass === body.pass) {
        const token = jwt.sign(
          { role: "master-admin", hi: Math.random() },
          JWT_SECRET,
          { expiresIn: "1h" }
        );






        // Get current file info to find SHA
        const getFile = await fetch(url, {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        if (!getFile.ok) {
          const err = await getFile.json();
          return NextResponse.json({ message: err.message }, { status: getFile.status });
        }

        const fileData = await getFile.json();
        const sha = fileData.sha;

        const updateFile = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: "Update JSON file",
            content: Buffer.from(
              JSON.stringify({
                pass: content.pass,
                token,
              })
            ).toString("base64"),
            sha,
          }),
        });





        return new Response(
          JSON.stringify({ success: true, message: "Password matched", token }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }
      else {
        return new Response(
          JSON.stringify({ success: false, message: "Password incorrect" }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { message: "Server error", error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }


  }
  else if (body.type === "change") {
    const { token, newPassword, id } = body;

    if (!token || !newPassword || !id) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }



    const url = `${URL}/passwords/master-admin.json`;

    const githubRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw",
      },
    });

    if (!githubRes.ok) {
      const errorBody = await githubRes.json();
      return NextResponse.json(
        { message: errorBody.message || "GitHub API error" },
        { status: githubRes.status, headers: corsHeaders }
      );
    }

    const content = await githubRes.json();

    if (content.token === token) {
      const urls = `${URL}/passwords/${id}.json`;

      const githubRes = await fetch(urls, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3.raw",
        },
      });

      if (!githubRes.ok) {
        const errorBody = await githubRes.json();
        return NextResponse.json(
          { message: errorBody.message || "GitHub API error" },
          { status: githubRes.status, headers: corsHeaders }
        );
      }


      const admin = await githubRes.json();
      if (admin) {

        // Hash the new password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const adminToken = jwt.sign(
          { id, role: "admin", hi: Math.random() }, // payload
          JWT_SECRET,
          { expiresIn: "1h" }               // token expiry, adjust as needed
        );




        const getFile = await fetch(`${URL}/passwords/${id}.json`, {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        if (!getFile.ok) {
          const err = await getFile.json();
          return NextResponse.json({ message: err.message }, { status: getFile.status });
        }

        const fileData = await getFile.json();
        const sha = fileData.sha;

        await fetch(urls, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: "Update JSON file",
            content: Buffer.from(
              JSON.stringify({
                pass: hashedPassword,
                token: adminToken,
                ids: id
              })
            ).toString("base64"),
            sha,
          }),
        });


        return new Response(
          JSON.stringify({ success: true, token: adminToken }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );



        // admin.token = adminToken;


        // await admin.save();
      }
      else {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid id" }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }
    }
    else {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or expired token" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }




    return new Response(
      JSON.stringify({ success: true, message: "Password updated successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
  else if (body.type === "admin-login") {

    const { id, password } = body;

    if (!password || !id) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing id or password" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }


    const url = `${URL}/passwords/${id}.json`;

    const githubRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw",
      },
    });

    if (!githubRes.ok) {
      const errorBody = await githubRes.json();
      return NextResponse.json(
        { message: errorBody.message || "GitHub API error" },
        { status: githubRes.status, headers: corsHeaders }
      );
    }

    const admin = await githubRes.json();

    if (!admin) {
      return new Response(
        JSON.stringify({ success: false, message: "Admin not found" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Compare password using bcrypt
    const isValid = await bcrypt.compare(password, admin.pass);
    if (!isValid) {
      return new Response(
        JSON.stringify({ success: false, message: "Incorrect password" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Generate JWT token for admin
    const adminToken = jwt.sign(
      { id, role: "admin", hi: Math.random(), },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // admin.token = adminToken;
    // await admin.save();

    // Get current file info to find SHA
    const getFile = await fetch(`${URL}/passwords/${id}.json`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!getFile.ok) {
      const err = await getFile.json();
      return NextResponse.json({ message: err.message }, { status: getFile.status });
    }

    const fileData = await getFile.json();
    const sha = fileData.sha;

    await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: "Update JSON file",
        content: Buffer.from(
          JSON.stringify({
            pass: admin.pass,
            token: adminToken,
            ids: id
          })
        ).toString("base64"),
        sha,
      }),
    });

    return new Response(
      JSON.stringify({ success: true, token: adminToken }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  }
  else if (body.type === "admin-verify") {

    const { id, password } = body;

    if (!password || !id) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing id or password" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }


    const url = `${URL}/passwords/${id}.json`;

    const githubRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw",
      },
    });

    if (!githubRes.ok) {
      const errorBody = await githubRes.json();
      return NextResponse.json(
        { message: errorBody.message || "GitHub API error" },
        { status: githubRes.status, headers: corsHeaders }
      );
    }

    const admin = await githubRes.json();

    if (!admin) {
      return new Response(
        JSON.stringify({ success: false, message: "Admin not found" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Compare password using bcrypt
    const isValid = password === admin.token
    if (!isValid) {
      return new Response(
        JSON.stringify({ success: false, message: "Incorrect password" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, token: adminToken }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  }
  else if (body.type === "get-constitution") {
    try {
      const url = `${URL}/pages/constitution.json`;

      const githubRes = await fetch(url, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3.raw",
        },
      });

      if (!githubRes.ok) {
        const errorBody = await githubRes.json();
        return NextResponse.json(
          { message: errorBody.message || "GitHub API error" },
          { status: githubRes.status, headers: corsHeaders }
        );
      }

      const content = await githubRes.json();

      return NextResponse.json(
        { content },
        { headers: corsHeaders }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Server error", error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }
  }
  else if (body.type === "get-constitution-access") {
    try {
      const url = `${URL}/passwords/drafting.json`;
      const { token } = body
      const githubRes = await fetch(url, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3.raw",
        },
      });

      if (!githubRes.ok) {
        const errorBody = await githubRes.json();
        return NextResponse.json(
          { message: errorBody.message || "GitHub API error" },
          { status: githubRes.status, headers: corsHeaders }
        );
      }

      const content = await githubRes.json();
      if (content.token === token) {
        return NextResponse.json(
          { message: "success", success: "ok" },
          { status: 200, headers: corsHeaders }
        );
      }
      else {
        return new Response(
          JSON.stringify({ success: false, message: "Invalid request type" }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { message: "Server error", error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }
  }
  else if (body.type === "update-constitution") {

    const { token, data } = body;
    console.log(token)
    if (!token || !data) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing id or password" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }


    const url = `${URL}/pages/constitution.json`;
    console.log(url)
    const getFile = await fetch(url, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!getFile.ok) {
      const err = await getFile.json();
      return NextResponse.json({ message: err.message }, { status: getFile.status });
    }

    const fileData = await getFile.json();
    const sha = fileData.sha;

    await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: "Update JSON file",
        content: Buffer.from(
          JSON.stringify(data)
        ).toString("base64"),
        sha,
      }),
    });

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  }
  else if (body.type === "aa") {
    await connectMongo();

    const found = await Subject.find();
    return new Response(JSON.stringify(found), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
  else if (body.type === "aann") {
    await connectMongo();

    const found = await Subject.deleteMany({});
    console.log(body)
    await Subject.insertMany(body.data)
    return new Response(
      JSON.stringify({ status: "Ok" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );


  }
}
