import { HorizontalScrollArea } from '../ui/HorizontalScrollArea';
import { TabBar } from './BookToolbarStyles';

export function ScrollableTabBar({ as: Component = TabBar, children, ...rest }) {
  return (
    <HorizontalScrollArea as={Component} {...rest}>
      {children}
    </HorizontalScrollArea>
  );
}
