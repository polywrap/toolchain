from dataclasses import dataclass
from typing import Callable

from polywrap_msgpack import msgpack_encode
from wasmtime import Store, Module

from .core_mock import InvokeOptions, State
from .imports import create_imports


@dataclass(slots=True, kw_only=True)
class WasmWrapper:
    wasm_module: str = "./polywrap_wasm/wrap2.wasm"

    def get_wasm_module(self):
        pass

    def create_wasm_instance(self, store: Store, state: State, abort: Callable[[str], None]):
        module = Module.from_file(store.engine, self.wasm_module)
        instance = create_imports(store, module, state, abort)
        return instance

    def invoke(self, options: InvokeOptions = None):
        self.get_wasm_module()
        state = State(invoke={}, method=options.method)
        arguments = msgpack_encode({}) if options.args is None else options.args
        state.args = arguments if isinstance(arguments, bytes) else msgpack_encode(arguments)
        state.env = msgpack_encode(options.env) if options.env else msgpack_encode({})

        method_length = len(options.method)
        args_length = len(state.args)
        env_length = len(state.env)

        def abort(message: str):
            raise BaseException(f"""
            WasmWrapper: Wasm module aborted execution
            URI:
            Method: 
            Args:
            Message: {message}""")

        store = Store()
        instance = self.create_wasm_instance(store, state, abort)
        exports = instance.exports(store)
        result = exports["_wrap_invoke"](
            store,
            method_length,
            args_length,
            env_length
        )
        # TODO: Handle invoke result error
        return _process_invoke_result(state, result, abort)


def _process_invoke_result(state: State, result: int, abort: Callable[[str], None]):
    print(state)
    print(result)
    if result:
        if state.invoke['result']:
            return state.invoke['result']

        abort("Invoke result is missing")
    else:
        if state.invoke['error']:
            print(state.invoke)
            raise BaseException(state.invoke['error'])

        abort("Invoke error is missing.")
