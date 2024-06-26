import {FilterMixin} from "./filter-mixin.mjs";

const {SchemaField, NumberField} = foundry.data.fields;

export class HealthPercentagesField extends FilterMixin(SchemaField) {
  static name = "healthPercentages";

  constructor(fields = {}, options = {}) {
    super({
      value: new NumberField({
        min: 0,
        max: 100,
        step: 1,
        integer: true,
        nullable: true, // nullable required to be able to remove it
        initial: 50,
        label: "BABONUS.Filters.HealthPercentages.ValueLabel"
      }),
      type: new NumberField({
        initial: null,
        nullable: true, // nullable required to be able to remove it
        choices: {
          0: "BABONUS.Filters.HealthPercentages.OptionLess",
          1: "BABONUS.Filters.HealthPercentages.OptionMore"
        },
        label: "BABONUS.Filters.HealthPercentages.TypeLabel"
      }),
      ...fields
    }, {
      label: "BABONUS.Filters.HealthPercentages.Label",
      hint: "BABONUS.Filters.HealthPercentages.Hint",
      ...options
    });
  }

  /** @override */
  static render(bonus) {
    const template = `
    <fieldset>
      <legend>
        {{localize label}}
        <a data-action="deleteFilter" data-id="${this.name}">
          <i class="fa-solid fa-trash"></i>
        </a>
      </legend>
      <p class="hint">{{localize hint}}</p>
      {{formGroup valueField value=value localize=true}}
      {{formGroup typeField value=type localize=true}}
    </fieldset>`;

    const schema = bonus.schema.getField(`filters.${this.name}`);
    const valueField = bonus.schema.getField(`filters.${this.name}.value`);
    const typeField = bonus.schema.getField(`filters.${this.name}.type`);
    const data = {
      valueField: valueField,
      typeField: typeField,
      value: bonus.filters[this.name].value,
      type: bonus.filters[this.name].type,
      hint: schema.hint,
      label: schema.label
    };

    return Handlebars.compile(template)(data);
  }

  /** @override */
  static storage(bonus) {
    return !Object.values(this.value(bonus)).includes(null);
  }
}
