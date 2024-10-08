import { NextRequest } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

const PYTHON_API_URL = process.env.PYTHON_API_URL;

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return new Response("Unauthorized: no token", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const forceSync = searchParams.get("force_sync");
  const url = `${PYTHON_API_URL}/gmail/synchronize?year=${year}&month=${month}&force_sync=${forceSync}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        Refresh: `${session?.refreshToken}`,
      },
    });

    if (!response.ok) {
      return new Response("Error from Python API", {
        status: response.status,
      });
    }

    const reader = response.body!.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } catch (error) {
          console.error("Stream reading error:", error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in GET request:", error);

    // Assurez-vous de toujours retourner une réponse, même en cas d'erreur
    return Response.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
