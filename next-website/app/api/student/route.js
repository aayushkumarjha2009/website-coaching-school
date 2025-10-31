import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { NextResponse } from "next/server";
import Student from "@/app/models/students";
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

  if (body.type === "add-student") {
    try {
      function de(t) {
        let hi = t
        delete hi.pass;
        return hi
      }

      function transformStudent(data) {
        return {
          name: data.name || "",
          class: data.class || "",
          stid: data.stid || "",
          pass: data.pass || "",
          subject: (data.subjects || []).map((id) => ({ id })),
          token: jwt.sign(
            { id: data.stid, hi: Math.random() },
            JWT_SECRET,
            { expiresIn: "1h" }
          )
        };
      }
      await connectMongo();

      const stdata = transformStudent(body.data);
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(stdata.pass, saltRounds);
      stdata.pass = hashedPassword
      const hi = await Student.insertOne(stdata)
      // const hi = {}
      return NextResponse.json(
        { body: de(stdata) },
        { status: 200, headers: corsHeaders }
      );

    }
    catch (error) {
      return NextResponse.json(
        { message: "Server error", error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

  }
  else if (body.type === "get-students") {
    try {
      const hi = await Student.find()
      const his = hi

      return NextResponse.json(
        { data: hi },
        { status: 200, headers: corsHeaders }
      );

    }
    catch (error) {
      return NextResponse.json(
        { message: "Server error", error: error.message },
        { status: 500, headers: corsHeaders }
      );
    }

  }
}
