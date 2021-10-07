import { Personalize } from "@uniformdev/optimize-tracker-react";
import camelCase from "lodash/camelCase";
import upperFirst from "lodash/upperFirst";
import * as React from "react";
// import SliceResolver from "../sm-resolver";
import { IEnhancedUnknownSlice } from "./UniformSliceZone";

export type TSliceResolver = (
  slice: IEnhancedUnknownSlice & { sliceName: string }
) => React.FunctionComponent<{ slice: IEnhancedUnknownSlice }>;

function ComponentMapper(sliceResolver: TSliceResolver) {
  return (slice: IEnhancedUnknownSlice) => {
    const SliceComponent = sliceResolver({
      ...slice,
      sliceName: upperFirst(camelCase(slice.slice_type)),
    });

    return <SliceComponent slice={slice} />;
  };
}

export default function PersonalisedSliceAlt({
  slice,
  sliceResolver,
}: {
  slice: IEnhancedUnknownSlice;
  sliceResolver: TSliceResolver;
}) {
  return (
    <Personalize
      variations={slice.uniformVariations}
      component={ComponentMapper(sliceResolver)}
    />
  );
}
