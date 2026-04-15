import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  
  if (!query) {
    return NextResponse.json({ items: [] });
  }

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&printType=books&maxResults=8&fields=items(id,volumeInfo/title,volumeInfo/authors,volumeInfo/imageLinks)&key=${process.env.GOOGLE_BOOKS_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data);
}