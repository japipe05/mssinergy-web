import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  password: string;
  creado_en: string;
};

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const [rows] = await db.query<Usuario[]>('SELECT * FROM usuario WHERE id = ?', [context.params.id]);
    if (rows.length === 0) {
      return NextResponse.json({ message: 'No encontrado' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const { nombre, correo, password } = await req.json();

  try {
    await db.query(
      'UPDATE usuario SET nombre = ?, correo = ?, password = ? WHERE id = ?',
      [nombre, correo, password, context.params.id]
    );
    return NextResponse.json({ message: 'Usuario actualizado' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    await db.query('DELETE FROM usuario WHERE id = ?', [context.params.id]);
    return NextResponse.json({ message: 'Usuario eliminado' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
