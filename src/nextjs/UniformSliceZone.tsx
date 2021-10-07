import * as React from "react";
import PersonalisedSlice, { TSliceResolver } from "./PersonalisedSlice";
import flatten from "lodash/flatten";
import groupBy from "lodash/groupBy";
import uniqueId from "lodash/uniqueId";
import { IntentTagVector } from "@uniformdev/optimize-common";

export type TUnknownSlice = {
  primary: {
    intent?: { id: string; [_key: string]: unknown };
    personalisationid?: string;
    [_key: string]: unknown;
  };
  items: Record<string, unknown>[];
  slice_label: string | null;
  slice_type: string;
  variation: string;
  [_key: string]: unknown;
};

export interface IEnhancedUnknownSlice extends TUnknownSlice {
  uniformVariations: IEnhancedUnknownSlice[];
  intentTag: { intents: IntentTagVector } | undefined;
  key?: string;
}

export default function UniformSliceZone({
  data,
  sliceResolver,
}: {
  data: { [_key: string]: TUnknownSlice[] };
  sliceResolver: TSliceResolver;
}) {
  const { body: defaultSlices = [], ...variationSliceBodies } = data;

  const variationSlices = flatten(Object.values(variationSliceBodies)).map(
    (slice) => ({
      ...slice,
      intentTag: { intents: slice.primary.intent || null },
    })
  );

  const groupedSlices = groupBy(
    [
      ...defaultSlices.map((s) => ({ ...s, intentTag: undefined })),
      ...variationSlices,
    ],
    "primary.personalisationid"
  );

  const slices = defaultSlices.map((slice) => ({
    ...slice,
    key: uniqueId(),
    uniformVariations: slice.primary.personalisationid
      ? groupedSlices[slice.primary.personalisationid]
      : [],
    intentTag: undefined,
  })) as IEnhancedUnknownSlice[];

  return (
    <>
      {slices.map((slice) => (
        <PersonalisedSlice
          key={slice.key}
          slice={slice}
          sliceResolver={sliceResolver}
        />
      ))}
    </>
  );
}
