import { NextRequest } from "next/server";

const PYTHON_API_URL = process.env.PYTHON_API_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const from = searchParams.get("from");
  const size = searchParams.get("size");
  const url = `${PYTHON_API_URL}/documents/search?q=${query}&from=${from}&size=${size}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return new Response("Error searching documents", {
        status: response.status,
      });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in GET request:", error);

    return Response.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
