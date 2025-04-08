// src/app/api/usuario/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { nombre, correo, password } = await req.json();

  try {
    const [result] = await db.query(
      'INSERT INTO usuario (nombre, correo, password) VALUES (?, ?, ?)',
      [nombre, correo, password]
    );
    return NextResponse.json({ message: 'Usuario creado', id: (result as any).insertId });
  } catch (error) {
    return NextResponse.json({ error: (error as any).message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM usuario');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: (error as any).message }, { status: 500 });
  }
}