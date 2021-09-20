pub mod serialization;
use polywrap_wasm_rs::{
    Read,
    Write,
};
use serde::{
    Deserialize,
    Serialize,
};
pub use serialization::{
    deserialize_test_import_object,
    read_test_import_object,
    serialize_test_import_object,
    write_test_import_object,
};

use crate::TestImportAnotherObject;
use crate::TestImportEnum;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct TestImportObject {
    pub object: Box<TestImportAnotherObject>,
    pub opt_object: Option<Box<TestImportAnotherObject>>,
    pub object_array: Vec<Box<TestImportAnotherObject>>,
    pub opt_object_array: Option<Vec<Option<Box<TestImportAnotherObject>>>>,
    pub en: TestImportEnum,
    pub opt_enum: Option<TestImportEnum>,
    pub enum_array: Vec<TestImportEnum>,
    pub opt_enum_array: Option<Vec<Option<TestImportEnum>>>,
}

impl TestImportObject {
    pub const URI: &'static str = "testimport.uri.eth";

    pub fn to_buffer(input: &TestImportObject) -> Vec<u8> {
        serialize_test_import_object(input)
    }

    pub fn from_buffer(input: &[u8]) -> TestImportObject {
        deserialize_test_import_object(input)
    }

    pub fn write<W: Write>(input: &TestImportObject, writer: &mut W) {
        write_test_import_object(input, writer);
    }

    pub fn read<R: Read>(reader: &mut R) -> TestImportObject {
        read_test_import_object(reader).expect("Failed to read TestImportObject")
    }
}
