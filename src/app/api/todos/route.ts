import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const todo = await prisma.todo.create({
      data: {
        text: body.text,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        priority: body.priority,
        categories: body.categories || [],
      },
    });
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
} 