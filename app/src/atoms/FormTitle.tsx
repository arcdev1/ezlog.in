import * as React from "react";

export default function FieldSet(
  props: React.HTMLAttributes<HTMLHeadingElement>
) {
  const { className, ...noClassProps } = props;
  return (
    <div>
      <h2 className="formTitle" {...noClassProps}>
        {props.children}
      </h2>
    </div>
  );
}
