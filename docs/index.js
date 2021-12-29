/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 *
 * Heavily modified by Alexey Raspopov
 */

function encode(tokens) {
  if (tokens instanceof Token) {
    return new Token(tokens.type, encode(tokens.content), tokens.alias);
  } else if (Array.isArray(tokens)) {
    return tokens.map(encode);
  } else {
    return tokens
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/\u00a0/g, " ");
  }
}

let lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
function getLanguage(element) {
  let match = lang.exec(element.className);
  if (match) {
    return match[1].toLowerCase();
  }
  return "none";
}

let languages = {
  clike: {
    comment: [
      {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: true,
        greedy: true,
      },
      {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true,
        greedy: true,
      },
    ],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true,
    },
    "class-name": {
      pattern:
        /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
      lookbehind: true,
      inside: {
        punctuation: /[.\\]/,
      },
    },
    keyword:
      /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while|import|from|export|let|const)\b/,
    boolean: /\b(?:false|true)\b/,
    function: /\b\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|=>|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    punctuation: /[{}[\];(),.:]/,
  },
};

function highlightAll() {
  let elements = document.querySelectorAll('pre[class*="language-"]');
  for (let element of elements) {
    let language = getLanguage(element);
    let cursor = element.firstElementChild;
    while (cursor != null) {
      highlightElement(cursor, language);
      cursor = cursor.nextElementSibling;
    }
  }
}

function highlightElement(element, language) {
  let grammar = languages[language];

  let code = element.textContent;
  if (!code) return;

  element.innerHTML = grammar ? highlight(code, grammar, language) : encode(code);
}

function highlight(text, grammar, language) {
  let tokens = tokenize(text, grammar);
  return stringify(encode(tokens), language);
}

function tokenize(text, grammar) {
  var rest = grammar.rest;
  if (rest) {
    for (var token in rest) {
      grammar[token] = rest[token];
    }

    delete grammar.rest;
  }

  var tokenList = new LinkedList();
  addAfter(tokenList, tokenList.head, text);
  matchGrammar(text, tokenList, grammar, tokenList.head, 0);
  return toArray(tokenList);
}

function Token(type, content, alias, matchedStr) {
  this.type = type;
  this.content = content;
  this.alias = alias;
  this.length = (matchedStr || "").length | 0;
}

function stringify(o, language) {
  if (typeof o == "string") {
    return o;
  }
  if (Array.isArray(o)) {
    var s = "";
    o.forEach(function (e) {
      s += stringify(e, language);
    });
    return s;
  }

  var env = {
    type: o.type,
    content: stringify(o.content, language),
    tag: "span",
    classes: ["token", o.type],
    attributes: {},
    language: language,
  };

  var aliases = o.alias;
  if (aliases) {
    if (Array.isArray(aliases)) {
      Array.prototype.push.apply(env.classes, aliases);
    } else {
      env.classes.push(aliases);
    }
  }

  var attributes = "";
  for (var name in env.attributes) {
    attributes += " " + name + '="' + (env.attributes[name] || "").replace(/"/g, "&quot;") + '"';
  }

  return (
    "<" +
    env.tag +
    ' class="' +
    env.classes.join(" ") +
    '"' +
    attributes +
    ">" +
    env.content +
    "</" +
    env.tag +
    ">"
  );
}

function matchPattern(pattern, pos, text, lookbehind) {
  pattern.lastIndex = pos;
  var match = pattern.exec(text);
  if (match && lookbehind && match[1]) {
    // change the match to remove the text matched by the Prism lookbehind group
    var lookbehindLength = match[1].length;
    match.index += lookbehindLength;
    match[0] = match[0].slice(lookbehindLength);
  }
  return match;
}

function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
  for (var token in grammar) {
    if (!grammar.hasOwnProperty(token) || !grammar[token]) {
      continue;
    }

    var patterns = grammar[token];
    patterns = Array.isArray(patterns) ? patterns : [patterns];

    for (var j = 0; j < patterns.length; ++j) {
      if (rematch && rematch.cause == token + "," + j) {
        return;
      }

      var patternObj = patterns[j];
      var inside = patternObj.inside;
      var lookbehind = !!patternObj.lookbehind;
      var greedy = !!patternObj.greedy;
      var alias = patternObj.alias;

      if (greedy && !patternObj.pattern.global) {
        // Without the global flag, lastIndex won't work
        var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
        patternObj.pattern = RegExp(patternObj.pattern.source, flags + "g");
      }

      /** @type {RegExp} */
      var pattern = patternObj.pattern || patternObj;

      for (
        // iterate the token list and keep track of the current token/string position
        var currentNode = startNode.next, pos = startPos;
        currentNode !== tokenList.tail;
        pos += currentNode.value.length, currentNode = currentNode.next
      ) {
        if (rematch && pos >= rematch.reach) {
          break;
        }

        var str = currentNode.value;

        if (tokenList.length > text.length) {
          // Something went terribly wrong, ABORT, ABORT!
          return;
        }

        if (str instanceof Token) {
          continue;
        }

        var removeCount = 1; // this is the to parameter of removeBetween
        var match;

        if (greedy) {
          match = matchPattern(pattern, pos, text, lookbehind);
          if (!match || match.index >= text.length) {
            break;
          }

          var from = match.index;
          var to = match.index + match[0].length;
          var p = pos;

          // find the node that contains the match
          p += currentNode.value.length;
          while (from >= p) {
            currentNode = currentNode.next;
            p += currentNode.value.length;
          }
          // adjust pos (and p)
          p -= currentNode.value.length;
          pos = p;

          // the current node is a Token, then the match starts inside another Token, which is invalid
          if (currentNode.value instanceof Token) {
            continue;
          }

          // find the last node which is affected by this match
          for (
            var k = currentNode;
            k !== tokenList.tail && (p < to || typeof k.value === "string");
            k = k.next
          ) {
            removeCount++;
            p += k.value.length;
          }
          removeCount--;

          // replace with the new match
          str = text.slice(pos, p);
          match.index -= pos;
        } else {
          match = matchPattern(pattern, 0, str, lookbehind);
          if (!match) {
            continue;
          }
        }

        // eslint-disable-next-line no-redeclare
        var from = match.index;
        var matchStr = match[0];
        var before = str.slice(0, from);
        var after = str.slice(from + matchStr.length);

        var reach = pos + str.length;
        if (rematch && reach > rematch.reach) {
          rematch.reach = reach;
        }

        var removeFrom = currentNode.prev;

        if (before) {
          removeFrom = addAfter(tokenList, removeFrom, before);
          pos += before.length;
        }

        removeRange(tokenList, removeFrom, removeCount);

        var wrapped = new Token(
          token,
          inside ? tokenize(matchStr, inside) : matchStr,
          alias,
          matchStr,
        );
        currentNode = addAfter(tokenList, removeFrom, wrapped);

        if (after) {
          addAfter(tokenList, currentNode, after);
        }

        if (removeCount > 1) {
          // at least one Token object was removed, so we have to do some rematching
          // this can only happen if the current pattern is greedy

          /** @type {RematchOptions} */
          var nestedRematch = {
            cause: token + "," + j,
            reach: reach,
          };
          matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);

          // the reach might have been extended because of the rematching
          if (rematch && nestedRematch.reach > rematch.reach) {
            rematch.reach = nestedRematch.reach;
          }
        }
      }
    }
  }
}

function LinkedList() {
  var head = { value: null, prev: null, next: null };
  var tail = { value: null, prev: head, next: null };
  head.next = tail;

  this.head = head;
  this.tail = tail;
  this.length = 0;
}

function addAfter(list, node, value) {
  // assumes that node != list.tail && values.length >= 0
  var next = node.next;

  var newNode = { value: value, prev: node, next: next };
  node.next = newNode;
  next.prev = newNode;
  list.length++;

  return newNode;
}

function removeRange(list, node, count) {
  var next = node.next;
  for (var i = 0; i < count && next !== list.tail; i++) {
    next = next.next;
  }
  node.next = next;
  next.prev = node;
  list.length -= i;
}

function toArray(list) {
  let array = [];
  let node = list.head.next;
  while (node !== list.tail) {
    array.push(node.value);
    node = node.next;
  }
  return array;
}

let readyState = document.readyState;
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => highlightAll());
} else {
  window.requestAnimationFrame(() => highlightAll());
}
