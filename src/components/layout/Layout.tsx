import { ReactNode } from 'react';
import { Container } from './Container';
import { Logo } from './Logo';
import { ThemeToggle } from '../ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Container>
      <ThemeToggle />
      <Logo />
      {children}
    </Container>
  );
}