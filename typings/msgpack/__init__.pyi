"""
This type stub file was generated by pyright.
"""

from io import IOBase
import os
import sys
from typing import Any, Dict
from .exceptions import *
from .ext import ExtType, Timestamp
from .fallback import Packer, Unpacker, unpackb

version = ...
__version__ = ...
if os.environ.get("MSGPACK_PUREPYTHON") or sys.version_info[0] == 2:
    ...
else:
    ...
def pack(o: Any, stream: IOBase, **kwargs: Dict[Any, Any]) -> IOBase: # -> None:
    """
    Pack object `o` and write it to `stream`

    See :class:`Packer` for options.
    """
    ...

def packb(o: Any, **kwargs: Dict[Any, Any]) -> bytes: # -> None:
    """
    Pack object `o` and return packed bytes

    See :class:`Packer` for options.
    """
    ...

def unpack(stream: IOBase, **kwargs: Dict[Any, Any]) -> Any:
    """
    Unpack an object from `stream`.

    Raises `ExtraData` when `stream` contains extra bytes.
    See :class:`Unpacker` for options.
    """
    ...

load = ...
loads = ...
dump = ...
dumps = ...
