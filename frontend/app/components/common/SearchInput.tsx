import { useState } from 'react'
import Input from '../ui/input'
import Button from '../ui/button'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  onSearch: (value: string) => void
  className?: string
  placeholder?: string
}

const SearchInput = ({ onSearch, className, placeholder = '検索...' }: SearchInputProps) => {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(value)
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit">検索</Button>
    </form>
  )
}

export default SearchInput 