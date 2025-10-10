import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/dom';
import { toolCardTemplate } from '../src/components/toolCardTemplate';
import { renderHtml } from './utils/renderHtml';

describe('ToolCard template', () => {
  it('renders link with provided content', () => {
    const markup = toolCardTemplate({
      title: '测试工具',
      description: '这是一个测试工具卡片。',
      href: '/tools/test'
    });

    renderHtml(markup);

    expect(screen.getByRole('link', { name: /了解更多/ })).toHaveAttribute('href', '/tools/test');
    expect(screen.getByText('测试工具')).toBeInTheDocument();
    expect(screen.getByText('这是一个测试工具卡片。')).toBeInTheDocument();
  });
});
