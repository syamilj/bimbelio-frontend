import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { messages, historyId } = await req.json();
    console.log({ messages, historyId });
    // const res = await fetch("http://localhost:4000/test");
    // const resData = await res.json();
    // // console.log({ ada: resData });
    // return NextResponse.json({
    //   data: resData,
    // });
  } catch (error) {
    return NextResponse.json({
      error: error,
    });
  }
};
