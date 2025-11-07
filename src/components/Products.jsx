import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_PRODUCTS_API_URL || 'http://localhost:4002'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', price: '' })
  const [editingId, setEditingId] = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/products`)
      setProducts(res.data)
    } catch (error) {
      alert('Error al cargar productos: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.price) return

    try {
      await axios.post(`${API_URL}/products`, {
        name: formData.name,
        price: parseFloat(formData.price)
      })
      setFormData({ name: '', price: '' })
      fetchProducts()
      alert('Producto creado exitosamente')
    } catch (error) {
      alert('Error al crear producto: ' + error.message)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.price) return

    try {
      await axios.put(`${API_URL}/products/${editingId}`, {
        name: formData.name,
        price: parseFloat(formData.price)
      })
      setFormData({ name: '', price: '' })
      setEditingId(null)
      fetchProducts()
      alert('Producto actualizado exitosamente')
    } catch (error) {
      alert('Error al actualizar producto: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    try {
      await axios.delete(`${API_URL}/products/${id}`)
      fetchProducts()
      alert('Producto eliminado exitosamente')
    } catch (error) {
      alert('Error al eliminar producto: ' + error.message)
    }
  }

  const handleEdit = (product) => {
    setEditingId(product._id)
    setFormData({ name: product.name, price: product.price })
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: '', price: '' })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestión de Productos</h2>

      <form onSubmit={editingId ? handleUpdate : handleCreate} className="mb-8 bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Nombre del Producto"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {editingId ? '✏️ Actualizar' : '➕ Crear Producto'}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No hay productos registrados
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono text-xs">
                      {product._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
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