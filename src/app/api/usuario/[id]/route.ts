// src/app/api/usuario/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await db.query('SELECT * FROM usuario WHERE id = ?', [params.id]);
    if ((rows as any).length === 0) return NextResponse.json({ message: 'No encontrado' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: (error as any).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { nombre, correo, password } = await req.json();

  try {
    await db.query(
      'UPDATE usuario SET nombre = ?, correo = ?, password = ? WHERE id = ?',
      [nombre, correo, password, params.id]
    );
    return NextResponse.json({ message: 'Usuario actualizado' });
  } catch (error) {
    return NextResponse.json({ error: (error as any).message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.query('DELETE FROM usuario WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Usuario eliminado' });
  } catch (error) {
    return NextResponse.json({ error: (error as any).message }, { status: 500 });
  }
}
