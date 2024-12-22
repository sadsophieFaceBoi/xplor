import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Explorer from './org';

describe('Explorer Component', () => {
    it('renders correctly', () => {
        const { getByText } = render(<Explorer />);
        expect(getByText('Explorer')).toBeInTheDocument();
    });

    it('handles click events', () => {
        const { getByRole } = render(<Explorer />);
        const button = getByRole('button');
        button.click();
        expect(button).toHaveTextContent('Clicked');
    });
});