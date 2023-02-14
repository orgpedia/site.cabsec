# Document Flow Diagram
This diagram is an auto-generated from directory structure of `flow` directory and links present in `input` and `output` sub-folders (tasks). Click the box (task) to explore more.

```mermaid
graph TD;
	import/data_packages --> genSVG_;
	import/data_packages --> genSite_;
	genSite_ --> export;

	click export "https://github.com/orgpedia/site.cabsec/tree/main/export" "export";
	click import/data_packages "https://github.com/orgpedia/site.cabsec/tree/main/import/data_packages" "import/data_packages";
```
