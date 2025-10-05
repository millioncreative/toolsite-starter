import { describe, it, expect } from 'vitest';
import { render } from '@astrojs/test';
import ToolCard from '../ToolCard.astro';

describe('ToolCard', () => {
  it('renders title and description', async () => {
    const { getByText } = await render(ToolCard, {
      props: {
        title: '测试工具',
        description: '这是一个测试工具卡片。',
        href: '/tools/test'
      }
    });

    expect(getByText('测试工具')).toBeTruthy();
    expect(getByText('这是一个测试工具卡片。')).toBeTruthy();
  });
});
