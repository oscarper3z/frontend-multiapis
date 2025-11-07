import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_USERS_API_URL || 'http://localhost:4001'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [editingId, setEditingId] = useState(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/users`)
      setUsers(res.data)
    } catch (error) {
      alert('Error al cargar usuarios: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return

    try {
      await axios.post(`${API_URL}/users`, formData)
      setFormData({ name: '', email: '' })
      fetchUsers()
      alert('Usuario creado exitosamente')
    } catch (error) {
      alert('Error al crear usuario: ' + error.message)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return

    try {
      await axios.put(`${API_URL}/users/${editingId}`, formData)
      setFormData({ name: '', email: '' })
      setEditingId(null)
      fetchUsers()
      alert('Usuario actualizado exitosamente')
    } catch (error) {
      alert('Error al actualizar usuario: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return

    try {
      await axios.delete(`${API_URL}/users/${id}`)
      fetchUsers()
      alert('Usuario eliminado exitosamente')
    } catch (error) {
      alert('Error al eliminar usuario: ' + error.message)
    }
  }

  const handleEdit = (user) => {
    setEditingId(user.id)
    setFormData({ name: user.name, email: user.email })
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: '', email: '' })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>

      <form onSubmit={editingId ? handleUpdate : handleCreate} className="mb-8 bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {editingId ? '✏️ Actualizar' : '➕ Crear Usuario'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}