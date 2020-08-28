import * as React from "react";

export default function FieldSet(
  props: React.FieldsetHTMLAttributes<HTMLFieldSetElement>
) {
  const { className, ...noClassProps } = props;
  return (
    <div>
      <fieldset className="fieldSet" {...noClassProps}>
        {props.children}
      </fieldset>
    </div>
  );
}
