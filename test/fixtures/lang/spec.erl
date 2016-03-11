%%% File description
%%%                
%%% @file spec.erl

-module(spec).
-export([error/1]).

%% Print an error message
%% @function error
%% @param {String} message Error message
error(message) ->
  % Inline comment
  io:format(message).
