import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket, OkPacket } from 'mysql2';

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  password: string;
  creado_en: string;
};

export async function POST(req: NextRequest) {
  const { nombre, correo, password } = await req.json();

  try {
    const [result] = await db.query<OkPacket>(
      'INSERT INTO usuario (nombre, correo, password) VALUES (?, ?, ?)',
      [nombre, correo, password]
    );

    return NextResponse.json({ message: 'Usuario creado', id: result.insertId });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM usuario');
    const usuarios = rows as Usuario[];

    return NextResponse.json(usuarios);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
