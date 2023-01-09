import reduce from 'lodash/reduce'

export interface Tag {
  name: string
  value: `{{ ${string} }}`
  sample: string
}

export interface FlatTag extends Tag {
  breadcrumbs: string[]
}

export interface TagGroup {
  name: string
  rules?: Rules
  mergeTags: MergeTags
}

export type Rules = Record<string, Rule>

export interface Rule {
  name: string
  before: `{% ${string} %}`
  after: `{% ${string} %}`
}

export type MergeTags = Record<string, Tag | TagGroup>

export function flatten (mergeTags: MergeTags, breadcrumbs: string[] = []): FlatTag[] {
  return reduce(
    mergeTags,
    (tags: FlatTag[], obj): FlatTag[] => {
      if ('value' in obj) {
        tags.push({ ...obj, breadcrumbs })
      }

      if ('mergeTags' in obj) {
        return [
          ...tags,
          ...flatten(obj.mergeTags, [...breadcrumbs, obj.name])
        ]
      }

      return tags
    },
    []
  )
}

export const baseMergeTags: MergeTags = {
  account: {
    name: 'Account',
    mergeTags: {
      ...orgContactTags('account', 'Account')
    }
  },
  branding: {
    name: 'Branding',
    mergeTags: {
      ...orgContactTags('branding', 'Branding')
    }
  },
  depot: {
    name: 'Depot',
    mergeTags: {
      ...orgContactTags('depot', 'Depot')
    }
  },
  customer: {
    name: 'Customer',
    mergeTags: {
      ...orgContactTags('customer', 'Customer'),
      customerAccountsEmail: {
        name: 'Accounts Email',
        value: '{{ customer.accountsEmail }}',
        sample: 'customer.accounts@example.com'
      },
      customerAccountNumber: {
        name: 'Account Number',
        value: '{{ customer.accountNumber }}',
        sample: 'ACC-NUM-1'
      },
      customerSecondaryAccountNumber: {
        name: 'Secondary Account Number',
        value: '{{ customer.secondaryAccountNumber }}',
        sample: 'SEC-ACC-NUM-1'
      }
    }
  },
  site: {
    name: 'Site',
    mergeTags: {
      ...orgContactTags('site', 'Site'),
      siteContact: {
        name: 'Contact',
        value: '{{ site.contact }}',
        sample: 'Example Site Contact'
      }
    }
  },
  job: {
    name: 'Job',
    mergeTags: {
      templateName: {
        name: 'Template Name',
        value: '{{ job.template.name }}',
        sample: 'Delivery'
      },
      customerPO: {
        name: 'Customer PO',
        value: '{{ job.customerPO }}',
        sample: 'PO-123'
      },
      dueByStart: {
        name: 'Due By Start',
        mergeTags: datetimeTags('job.dueByStart')
      },
      dueByEnd: {
        name: 'Due By End',
        mergeTags: datetimeTags('job.dueByEnd')
      },
      jobTotalPrice: {
        name: 'Total Price',
        value: '{{ job.totalPrice }}',
        sample: '39.99'
      },
      jobTotalItems: {
        name: 'Total Items',
        value: '{{ job.itemCount }}',
        sample: '5'
      },
      jobInstructions: {
        name: 'Instructions',
        value: '{{ job.instructions }}',
        sample: `Go round the back.

Call if no answer.`
      }
    }
  },
  items: {
    name: 'Items',
    rules: loop('Repeat for each item', 'item', 'job.items'),
    mergeTags: itemTags('item', false)
  }
}

export const onRunMergeTags: MergeTags = {
  run: {
    name: 'Run',
    mergeTags: {
      etaStart: {
        name: 'ETA Start',
        mergeTags: datetimeTags('job.etaStart')
      },
      etaEnd: {
        name: 'ETA End',
        mergeTags: datetimeTags('job.etaEnd')
      },
      runPosition: {
        name: 'Position On Run',
        value: '{{ run.position }}',
        sample: '2'
      },
      runPositionOrdinal: {
        name: 'Position On Run (ordinal)',
        value: '{{ run.positionOrdinal }}',
        sample: '2nd'
      }
    }
  },
  driver: {
    name: 'Driver',
    mergeTags: {
      driverFirstName: {
        name: 'First Name',
        value: '{{ run.driver.firstName }}',
        sample: 'Example'
      },
      driverLastName: {
        name: 'Last Name',
        value: '{{ run.driver.lastName }}',
        sample: 'Driver'
      },
      driverPhone: {
        name: 'Phone',
        value: '{{ run.driver.phone }}',
        sample: '07987654321'
      }
    }
  }
}

export const podMergeTags: MergeTags = {
  pod: {
    name: 'POD',
    mergeTags: {
      completedAt: {
        name: 'Completed At',
        mergeTags: datetimeTags('pod.completedAt')
      }
    }
  },
  items: {
    name: 'Items',
    rules: loop('Repeat for each item', 'item', 'job.items'),
    mergeTags: itemTags('item', true)
  },
  adjustedItems: {
    name: 'Adjusted Items',
    rules: loop('Repeat for each item', 'adjustedItem', 'pod.adjustedItems'),
    mergeTags: {
      ...itemTags('adjustedItem', true),
      adjustmentCode: {
        name: 'Adjustment Code',
        value: '{{ item.adjustmentCode.code }}',
        sample: 'ADJ-CODE-REJ'
      },
      adjustmentCodeDescription: {
        name: 'Adjustment Code Description',
        value: '{{ item.adjustmentCode.description }}',
        sample: 'Rejected at Site'
      }
    }
  }
}

export function extractSampleValuesMap (mergeTags: MergeTags): Record<string, string> {
  return reduce(
    mergeTags,
    (result: Record<string, string>, contents, key) => {
      if ('sample' in contents) {
        result[key] = contents.sample
      }

      if ('mergeTags' in contents) {
        result = {
          ...result,
          ...extractSampleValuesMap(contents.mergeTags)
        }
      }

      return result
    },
    {}
  )
}

function loop (name: string, declaredVariable: string, sourceVariable: string): Rules {
  return {
    [`${declaredVariable}Repeat`]: {
      name,
      before: `{% for ${declaredVariable} in ${sourceVariable} %}`,
      after: `{% endfor %}`
    }
  }
}

function orgContactTags (qualifier: string, name: string): MergeTags {
  return {
    [`${qualifier}Name`]: {
      name: 'Name',
      value: `{{ ${qualifier}.name }}`,
      sample: `Example ${name}`
    },
    [`${qualifier}Email`]: {
      name: 'Email',
      value: `{{ ${qualifier}.email }}`,
      sample: `example@${name.toLowerCase()}.com`
    },
    [`${qualifier}Phone`]: {
      name: 'Phone',
      value: `{{ ${qualifier}.phone }}`,
      sample: '0131 123 4567'
    },
    [`${qualifier}Address`]: {
      name: 'Address',
      mergeTags: addressTags(qualifier, name)
    }
  }
}

function addressTags (qualifier: string, name: string): MergeTags {
  return {
    [`${qualifier}Address`]: {
      name: 'Full Address',
      value: `{{ ${qualifier}.address }}`,
      sample: `1 ${name} Park
${name} Road
${name}ton
EH1 1AA`
    },
    [`${qualifier}Address1`]: {
      name: 'Address 1',
      value: `{{ ${qualifier}.address1 }}`,
      sample: `${name} House`
    },
    [`${qualifier}Address2`]: {
      name: 'Address 2',
      value: `{{ ${qualifier}.address2 }}`,
      sample: `${name} Park`
    },
    [`${qualifier}Address3`]: {
      name: 'Address 3',
      value: `{{ ${qualifier}.address3 }}`,
      sample: `${name} Road`
    },
    [`${qualifier}City`]: {
      name: 'City',
      value: `{{ ${qualifier}.city }}`,
      sample: `${name}ton`
    },
    [`${qualifier}Region`]: {
      name: 'Region',
      value: `{{ ${qualifier}.region }}`,
      sample: `${name}shire`
    },
    [`${qualifier}Postcode`]: {
      name: 'Postcode',
      value: `{{ ${qualifier}.postcode }}`,
      sample: 'EH1 1AA'
    }
  }
}

function datetimeTags (qualifier: string): MergeTags {
  return {
    [`${qualifier}Date`]: {
      name: 'Date',
      mergeTags: {
        [`${qualifier}DateDMY`]: {
          name: 'DD/MM/YYYY',
          value: `{{ ${qualifier}.dateDMY }}`,
          sample: '31/12/2020'
        },
        [`${qualifier}DateMDY`]: {
          name: 'MM/DD/YYYY',
          value: `{{ ${qualifier}.dateMDY }}`,
          sample: '12/31/2020'
        },
        [`${qualifier}Day`]: {
          name: 'Day',
          mergeTags: {
            [`${qualifier}DayNumber`]: {
              name: 'Number',
              value: `{{ ${qualifier}.dayNumber }}`,
              sample: '31'
            },
            [`${qualifier}DayOrdinal`]: {
              name: 'Ordinal',
              value: `{{ ${qualifier}.dayOrdinal }}`,
              sample: '31st'
            },
            [`${qualifier}WeekdayLong`]: {
              name: 'Day of the Week (full)',
              value: `{{ ${qualifier}.weekdayLong }}`,
              sample: 'Monday'
            },
            [`${qualifier}WeekdayShort`]: {
              name: 'Day of the Week (abbrev)',
              value: `{{ ${qualifier}.weekdayShort }}`,
              sample: 'Mon'
            }
          }
        },
        [`${qualifier}Month`]: {
          name: 'Month',
          mergeTags: {
            [`${qualifier}MonthNumber`]: {
              name: 'Number',
              value: `{{ ${qualifier}.monthNumber }}`,
              sample: '12'
            },
            [`${qualifier}MonthNameLong`]: {
              name: 'Name (full)',
              value: `{{ ${qualifier}.monthNameLong }}`,
              sample: 'December'
            },
            [`${qualifier}MonthNameShort`]: {
              name: 'Name (abbrev)',
              value: `{{ ${qualifier}.monthNameShort }}`,
              sample: 'Dec'
            }
          }
        },
        [`${qualifier}Year`]: {
          name: 'Year',
          mergeTags: {
            [`${qualifier}Year2`]: {
              name: '2 Digits',
              value: `{{ ${qualifier}.year2 }}`,
              sample: '20'
            },
            [`${qualifier}Year4`]: {
              name: '4 Digits',
              value: `{{ ${qualifier}.year4 }}`,
              sample: '2020'
            }
          }
        }
      }
    },
    [`${qualifier}Time`]: {
      name: 'Time',
      mergeTags: {
        [`${qualifier}Time24`]: {
          name: '24 Hour',
          value: `{{ ${qualifier}.time24 }}`,
          sample: '14:30'
        },
        [`${qualifier}Time12`]: {
          name: '12 Hour',
          value: `{{ ${qualifier}.time12 }}`,
          sample: '2:30'
        },
        [`${qualifier}AmPm`]: {
          name: 'AM/PM',
          value: `{{ ${qualifier}.amPm }}`,
          sample: 'pm'
        }
      }
    }
  }
}

function itemTags (qualifier: string, includeFulfilled: boolean): MergeTags {
  return {
    [`${qualifier}Product`]: {
      name: 'Product',
      value: '{{ item.product }}',
      sample: 'Example Product'
    },
    [`${qualifier}MerchGroup`]: {
      name: 'Merch Group',
      value: '{{ item.merchGroup }}',
      sample: 'Example Merch Group'
    },
    [`${qualifier}QuantityOrdered`]: {
      name: 'Quantity Ordered',
      value: '{{ item.qtyOrdered }}',
      sample: '5'
    },
    ...includeFulfilled ? {
      [`${qualifier}QuantityFulfilled`]: {
        name: 'Quantity Fulfilled',
        value: '{{ item.qtyFulfilled }}',
        sample: '4'
      }
    } : {},
    [`${qualifier}UnitPrice`]: {
      name: 'Unit Price',
      value: '{{ item.unitPrice }}',
      sample: '12.99'
    },
    [`${qualifier}TotalPrice`]: {
      name: 'Total Price',
      value: '{{ item.totalPrice }}',
      sample: '64.95'
    },
    [`${qualifier}UnitWeight`]: {
      name: 'Unit Weight',
      value: '{{ item.unitWeight }}',
      sample: '15.5'
    },
    [`${qualifier}TotalWeight`]: {
      name: 'Total Weight',
      value: '{{ item.totalWeight }}',
      sample: '77.5'
    }
  }
}
