import Text "mo:base/Text";

import Float "mo:base/Float";
import Result "mo:base/Result";
import Debug "mo:base/Debug";

actor Calculator {
  public func calculate(x : Float, y : Float, op : Text) : async Result.Result<Float, Text> {
    switch (op) {
      case ("+") { #ok(x + y) };
      case ("-") { #ok(x - y) };
      case ("*") { #ok(x * y) };
      case ("/") {
        if (y == 0) {
          #err("Division by zero")
        } else {
          #ok(x / y)
        }
      };
      case (_) { #err("Invalid operation") };
    }
  };
}
