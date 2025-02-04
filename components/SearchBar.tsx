import { Form, InputGroup } from 'react-bootstrap'
import { Search } from 'react-bootstrap-icons'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({ searchTerm, onSearchChange, placeholder = 'Search resources...', className }: SearchBarProps) {
  return (
    <InputGroup className={className}>
      <InputGroup.Text className="bg-dark border-0">
        <Search className="text-white-50" />
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="bg-dark text-white border-0"
        style={{ boxShadow: 'none' }}
      />
    </InputGroup>
  )
} 