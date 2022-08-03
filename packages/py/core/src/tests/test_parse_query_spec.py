import pytest

from .. import create_query_document, parse_query, InvokeApiOptions, Uri


def test_typical_case_works():
    dummy = Uri("w3://dumb/dummy")
    doc = create_query_document(
        """
      mutation {
        someMethod(
          arg1: "hey"
          arg2: 4
          arg3: true
          arg4: null
          arg5: ["hey", "there", [5.5]]
          arg6: {
            prop: "hey"
            obj: {
              prop: 5
              var: $varOne
            }
          }
          var1: $varOne
          var2: $varTwo
        ) {
          someResult {
            prop1
            prop2
          }
        }
      }
    """
    )

    result = parse_query(dummy, doc, {"varOne": "var 1", "varTwo": 55})

    expected = {
        'someMethod': InvokeApiOptions(
            uri=dummy,
            method='someMethod',
            input={
                'arg1': 'hey',
                'arg2': 4,
                'arg3': True,
                'arg4': None,
                'arg5': ['hey', 'there', [5.5]],
                'arg6': {'prop': 'hey', 'obj': {'prop': 5, 'var': 'var 1'}},
                'var1': 'var 1',
                'var2': 55,
            },
            result_filter={'someResult': {'prop1': True, 'prop2': True}},
        )
    }

    assert result == expected


def test_multiple_queries():
    dummy = Uri("w3://dumb/dummy")
    queryMethods = """
        someMethod(
            arg1: 4
            arg2: ["hey", "there", [5.5]]
            arg3: {
                prop: "hey"
                obj: {
                prop: 5
                }
            }
            var1: $varOne
            var2: $varTwo
        ) {
            someResult {
                prop1
                prop2
            }
        }
        anotherMethod(
            arg: "hey"
            var: $varOne
        ) {
            resultOne
            resultTwo {
                prop
            }
        }
    """

    mutationMethods = """
    mutationSomeMethod: someMethod(
        arg1: 4
        arg2: ["hey", "there", [5.5]]
        arg3: {
            prop: "hey"
            obj: {
            prop: 5
            }
        }
        var1: $varOne
        var2: $varTwo
    ) {
        someResult {
            prop1
            prop2
        }
    }

    mutationAnotherMethod: anotherMethod(
        arg: "hey"
        var: $varOne
    ) {
        resultOne
        resultTwo {
            prop
        }
    }
    """

    doc = create_query_document(
        f"""
        mutation {{
            {mutationMethods}
        }}
        query {{
            {queryMethods}
        }}
    """
    )

    result = parse_query(
        dummy,
        doc,
        {
            "varOne": "var 1",
            "varTwo": 55,
        },
    )

    method1 = {
        "someMethod": InvokeApiOptions(
            uri=dummy,
            method="someMethod",
            input={
                "arg1": 4,
                "arg2": ["hey", "there", [5.5]],
                "arg3": {
                    "prop": "hey",
                    "obj": {
                        "prop": 5,
                    },
                },
                "var1": "var 1",
                "var2": 55,
            },
            result_filter={
                "someResult": {
                    "prop1": True,
                    "prop2": True,
                },
            },
        )
    }

    method2 = {
        "anotherMethod": InvokeApiOptions(
            uri=dummy,
            method="anotherMethod",
            input={
                "arg": "hey",
                "var": "var 1",
            },
            result_filter={
                "resultOne": True,
                "resultTwo": {
                    "prop": True,
                },
            },
        )
    }

    expected = {
        **method1,
        **method2,
        "mutationSomeMethod": method1["someMethod"],
        "mutationAnotherMethod": method2["anotherMethod"],
    }

    assert result == expected


def test_fail_empty_doc():
    dummy = Uri("w3://dumb/dummy")
    expected = "Empty query document found."
    with pytest.raises(ValueError, match=expected):
        doc = create_query_document("{ prop }")
        doc.definitions = []
        parse_query(dummy, doc)


def test_fail_no_query_operations():
    dummy = Uri("w3://dumb/dummy")
    expected = "Unrecognized root level definition type: fragment_definition\n\n\
                Please use a 'query' or 'mutation' operations."
    with pytest.raises(ValueError, match=expected):
        doc = create_query_document("fragment Something on Type { something }")
        parse_query(dummy, doc)


def test_fail_missing_method():
    dummy = Uri("w3://dumb/dummy")
    expected = "Empty selection set found. Please include the name of a method you'd like to query."
    with pytest.raises(ValueError, match=expected):
        doc = create_query_document("query { something }")
        doc.definitions[0].selection_set.selections = []
        parse_query(dummy, doc)


def test_fail_fragment_spread_within_operations():
    dummy = Uri("w3://dumb/dummy")
    expected = "Unsupported selection type found: fragment_spread"
    with pytest.raises(ValueError, match=expected):
        doc = create_query_document("query { ...NamedFragment }")
        parse_query(dummy, doc)


def test_fail_fragment_spread_on_result_values():
    dummy = Uri("w3://dumb/dummy")
    expected = "Unsupported result selection type found: fragment_spread"
    with pytest.raises(ValueError, match=expected):
        doc = create_query_document(
            """
            query {
            something(
                arg: 5
            ) {
                ...NamedFragment
            }
            }
        """
        )
        parse_query(dummy, doc)


def test_fail_no_variables_specified():
    dummy = Uri("w3://dumb/dummy")
    expected = "Variables were not specified, tried to resolve variable from query. Name: arg_1"
    with pytest.raises(ValueError, match=expected):
        doc = create_query_document(
            """
            mutation {
                someMethod(
                arg1: $arg_1
                )
            }
        """
        )
        parse_query(dummy, doc)


def test_fail_variables_missing():
    dummy = Uri("w3://dumb/dummy")
    expected = "Missing variable: arg_1"
    with pytest.raises(ValueError, match=expected):
        doc = create_query_document(
            """
            mutation {
                someMethod(
                arg1: $arg_1
                )
            }
        """
        )
        parse_query(
            dummy,
            doc,
            {
                "arg2": "not arg1",
            },
        )


def test_succeeds_when_variables_defined_falsy():
    dummy = Uri("w3://dumb/dummy")
    doc = create_query_document(
        """
        mutation {
            someMethod(
            arg1: $arg_1
            )
        }
    """
    )
    parse_query(
        dummy,
        doc,
        {
            "arg_1": 0,
        },
    )


def test_fail_duplicate_input_args():
    dummy = Uri("w3://dumb/dummy")
    expected = "Duplicate input argument found: arg1"
    with pytest.raises(ValueError, match=expected):
        doc = create_query_document(
            """
            mutation {
                someMethod(
                arg1: 5
                arg1: "hey"
                )
            }
        """
        )
        parse_query(dummy, doc)


def test_fail_duplicate_result_sections():
    dummy = Uri("w3://dumb/dummy")
    expected = "Duplicate result selections found: prop1"
    with pytest.raises(ValueError, match=expected):
        doc = create_query_document(
            """
            mutation {
                someMethod(
                arg1: 5
                ) {
                prop1
                prop1
                }
            }
        """
        )
        parse_query(dummy, doc)


def test_fail_duplicate_aliases():
    dummy = Uri("w3://dumb/dummy")
    expected = """Duplicate query name found "alias".
                    Please use GraphQL aliases that each have unique names."""
    with pytest.raises(ValueError, match=expected):
        doc = create_query_document(
            """
            mutation {
                alias: method(
                arg: "hey"
                ) {
                result
                }

                alias: method2(
                arg: "hey"
                ) {
                result
                }
            }
        """
        )
        parse_query(dummy, doc)


def test_fail_duplicate_methods_without_alias():
    dummy = Uri("w3://dumb/dummy")
    expected = """Duplicate query name found "method".
                    Please use GraphQL aliases that each have unique names."""
    with pytest.raises(ValueError, match=expected):
        doc = create_query_document(
            """
            mutation {
                method(
                arg: "hey"
                ) {
                result
                }

                method(
                arg: "hey"
                ) {
                result
                }
            }
        """
        )
        parse_query(dummy, doc)
