import { Form, InputGroup } from 'react-bootstrap'
import { Search } from 'react-bootstrap-icons'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ searchTerm, onSearchChange, placeholder = 'Search resources...' }: SearchBarProps) {
  return (
    <InputGroup>
      <InputGroup.Text className="bg-dark border-secondary">
        <Search className="text-secondary" />
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="bg-dark text-white border-secondary"
      />
    </InputGroup>
  )
} 