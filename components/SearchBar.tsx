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
      <InputGroup.Text className="border border-secondary border-end-0" style={{ backgroundColor: '#F1F5F9' }}>
        <Search className="text-muted" />
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border border-secondary border-start-0"
        style={{ 
          boxShadow: 'none',
          height: '38px',
          backgroundColor: '#F1F5F9'
        }}
      />
    </InputGroup>
  )
} 