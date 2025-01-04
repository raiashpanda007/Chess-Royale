import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@workspace/db';
const prisma = new PrismaClient();
import { createTournament } from '@/lib/Tournament/torunament.create';
export {createTournament as GET}