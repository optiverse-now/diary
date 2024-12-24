import React from 'react'
import { render, screen } from '@testing-library/react'
import Button from '../../../../app/components/ui/button'

describe('Button', () => {
  it('renders button with children', () => {
    render(<Button>テストボタン</Button>)
    expect(screen.getByText('テストボタン')).toBeInTheDocument()
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="outline">アウトラインボタン</Button>)
    const button = screen.getByText('アウトラインボタン')
    expect(button).toHaveClass('border-2')
  })
}) 