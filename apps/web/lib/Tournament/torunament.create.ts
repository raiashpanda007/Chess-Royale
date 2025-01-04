import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@workspace/db';
const prisma = new PrismaClient();
export async function createTournament(request: Request,response:Response) {
    return Response.json({message:"Hello World"});
}