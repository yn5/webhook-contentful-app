import styled from '@emotion/styled';
import tokens from '@contentful/forma-36-tokens';

interface RowProps {
  readonly my?: keyof typeof tokens;
}

const Row = styled.div<RowProps>`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: ${(props) => tokens[props.my || 'spacingM']} 0;
`;

export default Row;
