import { ScrollableTabBar } from '../layout/ScrollableTabBar';
import { SecondaryTabBar } from './styles';

export function ScrollableSecondaryTabBar({ children, ...rest }) {
  return (
    <ScrollableTabBar as={SecondaryTabBar} {...rest}>
      {children}
    </ScrollableTabBar>
  );
}
