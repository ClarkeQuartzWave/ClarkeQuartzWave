import { cn } from "../../utils/cn";
import styles from "./Button.module.css";

export const Button = ({
	className,
	...buttonProps
}: React.ComponentProps<"button">) => {
	return <button className={cn(styles.button, className)} {...buttonProps} />;
};
