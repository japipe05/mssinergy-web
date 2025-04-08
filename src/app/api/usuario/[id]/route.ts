// src/app/api/usuario/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  password: string;
  creado_en: string; // o Date, según tu base de datos
};

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await db.query<Usuario[]>('SELECT * FROM usuario WHERE id = ?', [params.id]);
    if (rows.length === 0) {
      return NextResponse.json({ message: 'No encontrado' }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
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
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.query('DELETE FROM usuario WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Usuario eliminado' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
