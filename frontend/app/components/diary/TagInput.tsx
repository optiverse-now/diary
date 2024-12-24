'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import Input from '../ui/input'

interface Tag {
  id: string
  name: string
}

interface TagInputProps {
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  suggestions: Tag[]
  onSuggestionsFetch: (query: string) => Promise<void>
  placeholder?: string
  className?: string
}

export default function TagInput({
  selectedTags,
  onTagsChange,
  suggestions,
  onSuggestionsFetch,
  placeholder,
  className
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setShowSuggestions(true)
    await onSuggestionsFetch(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      const newTag = { id: `new-${Date.now()}`, name: inputValue.trim() }
      onTagsChange([...selectedTags, newTag])
      setInputValue('')
      setShowSuggestions(false)
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      onTagsChange(selectedTags.slice(0, -1))
    }
  }

  const addTag = (tag: Tag) => {
    if (!selectedTags.some(t => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag])
    }
    setInputValue('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const removeTag = (tagToRemove: Tag) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagToRemove.id))
  }

  return (
    <div className={cn('relative', className)}>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-white">
        {selectedTags.map(tag => (
          <span
            key={tag.id}
            className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-primary/60 hover:text-primary"
            >
              ×
            </button>
          </span>
        ))}
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={selectedTags.length === 0 ? placeholder : ''}
          className="flex-1 border-none p-0 min-w-[120px] focus:ring-0"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map(suggestion => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => addTag(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              {suggestion.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 