'use strict';
// Developer certification 5-0157 — glossary (area 'dev'). All definitions original.

module.exports = [
  // ---- OScript language
  { term: 'OScript', def: 'The interpreted, object-based language Content Server is written in and that modules are developed in. Statements one per line, blocks closed by `end`, declared types.', area: 'dev', guide: 'dev-oscript-basics' },
  { term: 'Assoc', def: 'OScript key → value map, created with `Assoc.CreateAssoc()` and read as `a.key` or `a.( expr )`.', area: 'dev', guide: 'dev-oscript-basics' },
  { term: 'List (OScript)', def: 'Ordered, 1-based collection of values of any type, written `{ 1, "two" }`; `{ @list, x }` builds a new list with x appended.', area: 'dev', guide: 'dev-oscript-basics' },
  { term: 'RecArray', def: 'OScript table of Records with named fields — what a SQL query returns from `CAPI.Exec`.', area: 'dev', guide: 'dev-oscript-basics' },
  { term: 'Record (OScript)', def: 'One row of a RecArray; fields are read by name, case-insensitively (`rec.DataID`).', area: 'dev', guide: 'dev-oscript-basics' },
  { term: 'Dynamic', def: 'OScript type that can hold a value of any type, decided at run time.', area: 'dev', guide: 'dev-oscript-basics' },
  { term: 'Undefined', def: 'The value of an OScript variable that has not been assigned; tested with `IsDefined()` / `IsUndefined()`.', area: 'dev', guide: 'dev-oscript-basics' },
  { term: 'Error value', def: 'What OScript built-ins return on failure instead of throwing an exception; tested with `IsError()`.', area: 'dev', guide: 'dev-oscript-basics' },
  { term: 'Status assoc', def: 'Content Server convention: a function returns an Assoc with `ok` (Boolean) and `errMsg` (String) so callers can check success in one place.', area: 'dev', guide: 'dev-oscript-basics' },
  { term: 'Echo', def: 'OScript built-in that writes its arguments to the server console and log output; used for tracing during development.', area: 'dev', guide: 'dev-debugging' },
  { term: 'Str package', def: 'OScript built-in package of string functions such as `Str.Upper`, `Str.Trim`, `Str.Elements` and `Str.Format`.', area: 'dev', guide: 'dev-oscript-basics' },
  { term: '$ global', def: 'An OScript name starting with $: an OSpace\'s published Globals object (`$LLIAPI`, `$WebNode`) or a constant such as `$TypeFolder`.', area: 'dev', guide: 'dev-features-init' },

  // ---- objects and OSpaces
  { term: 'OSpace', def: 'A saved collection of OScript objects, compiled into an .oll file and shipped in a module; loaded by the server at start-up.', area: 'dev', guide: 'dev-oscript-objects' },
  { term: 'Feature', def: 'A named member of an OScript object: either a value (Integer, String, List…) or a script. Children inherit their parent\'s features.', area: 'dev', guide: 'dev-oscript-objects' },
  { term: 'Script (OScript feature)', def: 'A feature that holds code — a main function of the same name and optional helper functions.', area: 'dev', guide: 'dev-oscript-objects' },
  { term: 'Orphan', def: 'A child of an object from another OSpace, kept in your own OSpace — the supported way to extend delivered objects without editing them.', area: 'dev', guide: 'dev-oscript-objects' },
  { term: 'Inheritance (OScript)', def: 'Single, prototype-based inheritance: each object has one parent and sees its features until it overrides them.', area: 'dev', guide: 'dev-oscript-objects' },
  { term: 'this', def: 'In an OScript script, the object the script was called on — so inherited scripts see the child\'s feature values.', area: 'dev', guide: 'dev-oscript-objects' },
  { term: 'Globals object', def: 'The object of an OSpace that is published as a $ global and points to the objects other code should reach.', area: 'dev', guide: 'dev-oscript-objects' },
  { term: 'Temporary object', def: 'A run-time child created with `OS.NewTemp` (often wrapped in a `New()` script) to hold per-call state; not saved in the OSpace.', area: 'dev', guide: 'dev-oscript-objects' },
  { term: '0 Setup', def: 'Conventional script name on delivered objects that the developer runs to (re)write the object\'s feature values at build time.', area: 'dev', guide: 'dev-features-init' },
  { term: '__Init', def: 'Conventional name of an initialisation script run when an OSpace is loaded; used for start-up set-up such as globals. Keep it short.', area: 'dev', guide: 'dev-features-init' },
  { term: 'fEnabled', def: 'Boolean feature that registries check at start-up; a child must set it TRUE to be registered (parents ship with FALSE).', area: 'dev', guide: 'dev-features-init' },
  { term: 'Subsystem', def: 'A registry that collects the enabled children of a known parent object at start-up and returns them by key, e.g. `$LLIAPI.LLNodeSubsystem.GetItem( 144 )`.', area: 'dev', guide: 'dev-features-init' },
  { term: 'Agent', def: 'An object registered with the agent framework that the server runs on a schedule, outside user requests.', area: 'dev', guide: 'dev-features-init' },

  // ---- modules and tools
  { term: 'Module (Content Server)', def: 'The deployable unit of Content Server code: a versioned folder with an ini file, OSpaces, WebLingo (html) and static (support) files.', area: 'dev', guide: 'dev-cside' },
  { term: 'Module ini file', def: 'The file in a module folder that records the module\'s identity, version, OSpaces and dependencies; read by the installer.', area: 'dev', guide: 'dev-cside' },
  { term: 'support folder', def: 'Module folder for static files — images, CSS, JavaScript — served directly by the web server.', area: 'dev', guide: 'dev-cside' },
  { term: 'CSIDE', def: 'Content Server Integrated Development Environment: OpenText\'s Eclipse plug-in for writing, building, loading and debugging OScript modules.', area: 'dev', guide: 'dev-cside' },
  { term: 'Builder', def: 'The older in-server OScript development tool that CSIDE replaced.', area: 'dev', guide: 'dev-cside' },
  { term: 'Staging directory', def: 'Folder under the Content Server installation where module folders are copied before Install Modules or Upgrade Modules.', area: 'dev', guide: 'dev-deploy' },
  { term: 'Module signing', def: 'Digitally signing a module so administrators can verify its publisher and that its files were not changed after signing.', area: 'dev', guide: 'dev-deploy' },

  // ---- web layer
  { term: 'Request handler', def: 'OScript object that serves a `?func=` URL: arguments checked against its prototype, logic in Execute, output rendered by its WebLingo file.', area: 'dev', guide: 'dev-request-handlers' },
  { term: 'func', def: 'URL argument that names the request handler to run, e.g. `?func=ll&objId=2000`.', area: 'dev', guide: 'dev-request-handlers' },
  { term: 'Execute', def: 'The request-handler script `Execute( ctxIn, ctxOut, request )` that holds the request\'s logic.', area: 'dev', guide: 'dev-request-handlers' },
  { term: 'fPrototype', def: 'Request-handler feature listing the URL arguments it accepts with type, optionality and default; usually built by a SetPrototype script.', area: 'dev', guide: 'dev-request-handlers' },
  { term: 'fHTMLFile', def: 'Request-handler feature naming the WebLingo file that renders the response.', area: 'dev', guide: 'dev-request-handlers' },
  { term: 'Program context', def: 'The per-request session object (prgCtx) giving OScript code the user\'s DAPI session and database connection.', area: 'dev', guide: 'dev-database' },
  { term: 'WebLingo', def: 'Classic UI template language: HTML with `;` lines of OScript, backtick output, `;;webscript` blocks and `;;call` includes.', area: 'dev', guide: 'dev-weblingo' },
  { term: 'Webscript', def: 'A `;;webscript name( args )` … `;;end` block in WebLingo — a reusable fragment that writes output and returns no value.', area: 'dev', guide: 'dev-weblingo' },
  { term: 'Xlate string', def: 'A localised label referenced in WebLingo as a bracketed key, e.g. `[WebWork_HTMLLabel.ReturnButtonLabel]`.', area: 'dev', guide: 'dev-weblingo' },

  // ---- nodes and data
  { term: 'LLNode', def: 'The object that implements a node type\'s data-side behaviour (create, copy, move, delete, versions), registered by subtype in `$LLIAPI.LLNodeSubsystem`.', area: 'dev', guide: 'dev-nodes' },
  { term: 'WebNode', def: 'The object that defines a node type\'s Classic UI presentation — icon, Add Item entry and commands — registered by subtype in `$WebNode.WebNodes`.', area: 'dev', guide: 'dev-nodes' },
  { term: 'CSNode', def: 'A wrapper around LLNode that exposes a node type\'s properties and actions to REST v2 and Smart View.', area: 'dev', guide: 'dev-nodes' },
  { term: 'Callback', def: 'An object Content Server calls during node operations (for all node types) so a module can react or veto without subclassing the types.', area: 'dev', guide: 'dev-nodes' },
  { term: 'DAPI', def: 'Built-in OScript package for node storage, e.g. `DAPI.GetNodeByID( session, DAPI.BY_DATAID, id )`, returning DAPINODE objects.', area: 'dev', guide: 'dev-database' },
  { term: 'DAPINODE', def: 'A node object returned by DAPI, with fields prefixed p: pID, pName, pSubType, pParentID.', area: 'dev', guide: 'dev-nodes' },
  { term: 'CAPI.Exec', def: 'OScript call that runs SQL on a database connection with bind variables (:A1, :A2…) and returns a RecArray or an Error.', area: 'dev', guide: 'dev-database' },
  { term: 'Bind variable', def: 'A placeholder such as `:A1` in SQL run by CAPI.Exec, filled from an argument — prevents SQL injection and handles types.', area: 'dev', guide: 'dev-database' },
  { term: 'OUnit', def: 'xUnit-style unit-testing framework for OScript: test objects with set-up, assertions and tear-down, run inside a Content Server.', area: 'dev', guide: 'dev-ounit' },

  // ---- schema

  // ---- services
  { term: 'REST API (Content Server)', def: 'JSON-over-HTTP interface under `…/api/v1` and `…/api/v2`, authenticated by a ticket; used by Smart View and most integrations.', area: 'dev', guide: 'dev-rest-fundamentals' },
  { term: 'OTCSTicket', def: 'The Content Server authentication ticket returned by `POST /api/v1/auth` and sent in the `OTCSTicket` header; refreshed tickets come back in response headers.', area: 'dev', guide: 'dev-rest-fundamentals' },
  { term: 'OTDSTicket', def: 'HTTP header in which a REST client can send an OTDS token instead of a Content Server ticket.', area: 'dev', guide: 'dev-rest-fundamentals' },
  { term: 'REST v2 envelope', def: 'The v2 response shape: elements as `results.data.properties`, lists as `results[ ].data.properties`, paging in `collection.paging`.', area: 'dev', guide: 'dev-rest-fundamentals' },
  { term: 'fields / expand', def: 'REST v2 parameters: fields limits which sections and properties are returned; expand inlines referenced objects.', area: 'dev', guide: 'dev-rest-fundamentals' },
  { term: 'Custom REST resource', def: 'An OScript object in a module that the REST framework routes URLs to; stateless and available for v1 and v2.', area: 'dev', guide: 'dev-rest-extend' },
  { term: 'Content Web Services (CWS)', def: 'SOAP web services for Content Server (Authentication, DocumentManagement, ContentService, MemberService, SearchService…), described by WSDL.', area: 'dev', guide: 'dev-cws' },
  { term: 'OTAuthentication header', def: 'SOAP header (namespace urn:api.ecm.opentext.com) whose AuthenticationToken element carries the CWS token on every call.', area: 'dev', guide: 'dev-cws' },
  { term: 'ContentService', def: 'CWS service that streams large file content for a context ID created through DocumentManagement.', area: 'dev', guide: 'dev-cws' },
  { term: 'WSDL', def: 'Web Services Description Language document describing a SOAP service\'s operations and types; client proxies are generated from it.', area: 'dev', guide: 'dev-cws' },
  { term: 'Service Data Object (SDO)', def: 'Strongly typed data structure exchanged by a Content Web Service, so the WSDL and generated clients know each field and type.', area: 'dev', guide: 'dev-cws-custom' },
  { term: 'Smart View UI SDK', def: 'JavaScript SDK for extending Smart View with new tiles and views; it talks to the server through the REST API.', area: 'dev', guide: 'dev-landscape' },
];
