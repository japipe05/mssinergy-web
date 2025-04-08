import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  password: string;
  creado_en: string;
};

interface Params {
  params: { id: string };
}

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = params;

  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM usuario WHERE id = ?', [id]);
    const usuario = rows[0] as Usuario | undefined;

    if (!usuario) {
      return NextResponse.json({ message: 'No encontrado' }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = params;

  try {
    const { nombre, correo, password } = await req.json();

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

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = params;

  try {
    await db.query('DELETE FROM usuario WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Usuario eliminado' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
