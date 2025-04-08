// src/app/usuarios/page.tsx
'use client';

import { useEffect, useState } from 'react';

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  password: string;
  creado_en: string;
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [form, setForm] = useState({ nombre: '', correo: '', password: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch('/api/usuario');
      const data = await res.json();
  
      if (Array.isArray(data)) {
        setUsuarios(data); // ✅ todo bien
      } else {
        console.error('La API no devolvió un array:', data);
        setUsuarios([]); // ❌ evita que sea undefined o un objeto
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setUsuarios([]);
    }
  };
  

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/usuario/${editingId}` : '/api/usuario';

    await fetch(url, {
      method,
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    setForm({ nombre: '', correo: '', password: '' });
    setEditingId(null);
    fetchUsuarios();
  };

  const handleEdit = (usuario: Usuario) => {
    setForm({ nombre: usuario.nombre, correo: usuario.correo, password: usuario.password });
    setEditingId(usuario.id);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/usuario/${id}`, { method: 'DELETE' });
    fetchUsuarios();
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Usuarios</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          className="w-full border p-2"
          placeholder="Nombre"
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
        />
        <input
          className="w-full border p-2"
          placeholder="Correo"
          type="email"
          value={form.correo}
          onChange={e => setForm({ ...form, correo: e.target.value })}
        />
        <input
          className="w-full border p-2"
          placeholder="Contraseña"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? 'Actualizar' : 'Crear'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ nombre: '', correo: '', password: '' });
            }}
            className="ml-4 bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        )}
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Correo</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td className="border p-2">{u.nombre}</td>
              <td className="border p-2">{u.correo}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
