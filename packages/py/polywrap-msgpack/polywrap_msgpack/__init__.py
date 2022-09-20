from typing import Any, Dict, List, Union
import msgpack
from enum import Enum


class ExtensionTypes(Enum):
    GENERIC_MAP = 1


def sanitize(value: Any) -> Union[Dict[Any, Any], List[Any]]:
    if type(value) is dict:
        dictionary: Dict[Any, Any] = value
        for key, val in dictionary.items():
            if type(key) == str:
                dictionary[key] = sanitize(val)
            else:
                raise ValueError(f"expected dict key to be str received {key} with type {type(key)}")
        return dictionary
    elif type(value) is list:
        array: List[Any] = value
        return [sanitize(a) for a in array]
    elif hasattr(value, "__slots__"):
        return {s: sanitize(getattr(value, s)) for s in getattr(value, "__slots__") if hasattr(value, s)}
    else:
        return {k: sanitize(v) for k, v in vars(value).items()}


def msgpack_encode(obj: object) -> bytes:
    sanitized = sanitize(obj)
    return msgpack.packb(sanitized)


def msgpack_decode(val: bytes):
    return msgpack.fallback.unpackb(val)
