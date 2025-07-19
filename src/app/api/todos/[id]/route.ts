import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const todo = await prisma.todo.update({
      where: { id: params.id },
      data: {
        text: body.text,
        completed: body.completed,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        priority: body.priority,
        categories: body.categories,
      },
    });
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.todo.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
} 