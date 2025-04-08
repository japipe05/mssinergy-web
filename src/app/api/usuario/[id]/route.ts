import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  password: string;
  creado_en: string;
};

export async function GET(
  request: NextRequest,
  context: { params: Record<string, string> }
) {
  try {
    const id = context.params.id;
    const [rows] = await db.query<Usuario[]>('SELECT * FROM usuario WHERE id = ?', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ message: 'No encontrado' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Record<string, string> }
) {
  try {
    const { nombre, correo, password } = await request.json();
    const id = context.params.id;

    await db.query(
      'UPDATE usuario SET nombre = ?, correo = ?, password = ? WHERE id = ?',
      [nombre, correo, password, id]
    );

    return NextResponse.json({ message: 'Usuario actualizado' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Record<string, string> }
) {
  try {
    const id = context.params.id;
    await db.query('DELETE FROM usuario WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Usuario eliminado' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
