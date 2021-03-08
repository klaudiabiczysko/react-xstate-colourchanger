export const grammar = `
<grammar root="smarthome">

<rule id="smarthome">
<item repeat="0-">please</item>
<item repeat="0-1">could you</item>
<ruleref uri="#control_home"/><tag>out.smarthome=rules.control_home</tag>
</rule>

<rule id="action1">
<one-of>
<item> turn </item>
<item> off <tag>out="off";</tag></item>
<item> on <tag>out="on";</tag></item>
<item> turn off <tag>out="off";</tag></item>
<item> turn on <tag>out="on";</tag></item>
</one-of>
</rule>

<rule id="action2">
<one-of>
<item> open <tag>out="opened";</tag></item>
<item> close <tag>out="closed";</tag></item>
</one-of>
</rule>

<rule id="object1">
<one-of>
<item> light </item>
<item> heat </item>
<item> A C <tag>out='air conditioning';</tag></item>
<item> AC <tag>out='air conditioning';</tag></item>
<item> air conditioning </item>
</one-of>
</rule>

<rule id="object2">
<one-of>
<item> window </item>
<item> door </item>
</one-of>
</rule>

<rule id="control_home">
<one-of>
<item>
<ruleref uri="#action1"/><tag>out.action = rules.action1</tag>
<item repeat="0-1"> the </item>
<ruleref uri="#object1"/><tag>out.object = rules.object1</tag>
<item repeat="0-1"><ruleref uri="#action1"/></item>
<tag>out.action = rules.action1</tag>
</item>

<item>
<ruleref uri="#action2"/> <tag> out.action = rules.action2</tag>
<item repeat="0-1"> the </item>
<ruleref uri="#object2"/> <tag>out.object = rules.object2</tag>
</item>
</one-of>
</rule>
</grammar>
`
