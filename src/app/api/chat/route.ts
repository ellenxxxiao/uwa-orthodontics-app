export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const res = await fetch(`https://dummyjson.com/todos/1`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const product = await res.json();

  return Response.json({ product });
}
