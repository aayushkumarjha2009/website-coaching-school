import connectMongo from "./../../lib/mongodb";
import Master from "./../../models/master-admin";
import Admin from "./../../models/admin";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3001", // Your frontend origin here
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true"

};

let GITHUB_TOKEN = ""

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_here";

export async function POST(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  await connectMongo();
  const body = await request.json();


  if (body.type === "connect") {
    const found = await Master.findOne({ pass: body.pass });

    if (found) {
      // Generate JWT token
      const token = jwt.sign(
        { id: found._id, role: "master-admin", hi: Math.random() },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Update token field in DB
      found.token = token;
      await found.save();


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
    } else {
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

    // Verify Master token by searching Master with that token in DB
    const master = await Master.findOne({ token });

    if (!master) {
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

    // Find Admin by id and update password
    const admin = await Admin.findOne({ ids: id });
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

    // Hash the new password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    admin.pass = hashedPassword;
    const adminToken = jwt.sign(
      { id: admin._id, role: "admin", hi: Math.random() }, // payload
      JWT_SECRET,
      { expiresIn: "1h" }               // token expiry, adjust as needed
    );

    admin.token = adminToken;


    await admin.save();


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

    // Find admin by id
    const admin = await Admin.findOne({ ids: id });
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
      { id: admin._id, role: "admin", hi: Math.random(), },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    admin.token = adminToken;
    await admin.save();

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
      const url = `https://api.github.com/repos/aayushkumarjha2009/coaching-data/contents/pages/constitution.json`;

      const githubRes = await fetch(url, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
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
}
