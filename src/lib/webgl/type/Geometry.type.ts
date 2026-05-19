export type AttributeData = Float32Array | Uint16Array | Uint32Array | Int16Array | Uint8Array | Int8Array;

export interface Attribute {
  size: number;
  data: AttributeData;
  type?: number;
  normalized?: boolean;
  location?: number;
}

export type AttributeMap = Record<string, Partial<Attribute>>;
