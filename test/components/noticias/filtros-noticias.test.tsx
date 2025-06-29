'use client'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FiltrosNoticias } from '@/components/noticias/filtros-noticias'

// Mock de los datos de categorías
jest.mock('@/data/categorias.json', () => ({
  categorias: [
    'Universidad Mayor de San Simón',
    'Facultad de Ciencias y Tecnología',
    'Facultad de Medicina',
    'Facultad de Ciencias Económicas',
    'Facultad de Ciencias Jurídicas y Políticas',
  ],
}))

describe('FiltrosNoticias', () => {
  const mockOnCategoriasChange = jest.fn()

  beforeEach(() => {
    mockOnCategoriasChange.mockClear()
  })

  it('renders filter component', () => {
    render(
      <FiltrosNoticias categoriasSeleccionadas={[]} onCategoriasChange={mockOnCategoriasChange} />,
    )

    expect(screen.getByText('Filtrar por Categorías')).toBeInTheDocument()
  })

  it('shows categories when expanded', async () => {
    const user = userEvent.setup()
    render(
      <FiltrosNoticias categoriasSeleccionadas={[]} onCategoriasChange={mockOnCategoriasChange} />,
    )

    const filterButton = screen.getByText('Mostrar')
    await user.click(filterButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/universidad mayor de san simón/i)).toBeInTheDocument()
    })
  })

  it('allows category selection', async () => {
    const user = userEvent.setup()
    render(
      <FiltrosNoticias categoriasSeleccionadas={[]} onCategoriasChange={mockOnCategoriasChange} />,
    )

    const filterButton = screen.getByText('Mostrar')
    await user.click(filterButton)

    await waitFor(() => {
      const categoryCheckbox = screen.getByLabelText(/universidad mayor de san simón/i)
      expect(categoryCheckbox).toBeInTheDocument()
    })

    const categoryCheckbox = screen.getByLabelText(/universidad mayor de san simón/i)
    await user.click(categoryCheckbox)

    expect(mockOnCategoriasChange).toHaveBeenCalledWith(['Universidad Mayor de San Simón'])
  })

  it('filters categories by search term', async () => {
    const user = userEvent.setup()
    render(
      <FiltrosNoticias categoriasSeleccionadas={[]} onCategoriasChange={mockOnCategoriasChange} />,
    )

    const filterButton = screen.getByText('Mostrar')
    await user.click(filterButton)

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Buscar categorías...')
      expect(searchInput).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText('Buscar categorías...')
    await user.type(searchInput, 'Tecnología')

    await waitFor(() => {
      expect(screen.getByLabelText(/facultad de ciencias y tecnología/i)).toBeInTheDocument()
      expect(screen.queryByLabelText(/universidad mayor de san simón/i)).not.toBeInTheDocument()
    })
  })
})
